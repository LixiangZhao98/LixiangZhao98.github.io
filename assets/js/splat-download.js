const DEFAULT_CHUNK_SIZE = 2 * 1024 * 1024;
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_REQUEST_TIMEOUT_MS = 60000;

function wait(delayMs) {
  return new Promise((resolve) => window.setTimeout(resolve, delayMs));
}

function parseContentRange(value) {
  const match = /^bytes\s+(\d+)-(\d+)\/(\d+)$/i.exec(value || "");
  if (!match) return null;
  return {
    start: Number(match[1]),
    end: Number(match[2]),
    total: Number(match[3])
  };
}

async function fetchRangeOnce(url, start, end, attempt, requestTimeoutMs, signal) {
  const controller = new AbortController();
  let requestTimedOut = false;
  const abortFromParent = () => controller.abort(signal.reason);

  if (signal && signal.aborted) {
    abortFromParent();
  } else if (signal) {
    signal.addEventListener("abort", abortFromParent, { once: true });
  }

  const timeoutId = window.setTimeout(() => {
    requestTimedOut = true;
    controller.abort();
  }, requestTimeoutMs);

  try {
    const requestUrl = new URL(url, window.location.href);
    requestUrl.searchParams.set("range", `${start}-${end}`);
    if (attempt > 1) {
      requestUrl.searchParams.set("rangeRetry", `${attempt}-${Date.now()}`);
    }

    const response = await fetch(requestUrl, {
      cache: "no-store",
      headers: {
        Range: `bytes=${start}-${end}`
      },
      signal: controller.signal
    });

    if (response.status !== 206 && !(start === 0 && response.status === 200)) {
      throw new Error(`SPLAT range request failed with HTTP ${response.status}.`);
    }

    const buffer = await response.arrayBuffer();
    if (response.status === 200) {
      return {
        buffer,
        completeFile: true,
        totalSize: buffer.byteLength
      };
    }

    const contentRange = parseContentRange(response.headers.get("Content-Range"));
    if (!contentRange || contentRange.start !== start || contentRange.end < contentRange.start) {
      throw new Error("SPLAT server returned an invalid byte range.");
    }

    const expectedLength = contentRange.end - contentRange.start + 1;
    if (buffer.byteLength !== expectedLength) {
      throw new Error(`SPLAT range was incomplete: expected ${expectedLength} bytes, received ${buffer.byteLength}.`);
    }

    return {
      buffer,
      completeFile: false,
      totalSize: contentRange.total
    };
  } catch (error) {
    if (signal && signal.aborted) {
      const abortedError = new Error("SPLAT download was cancelled.");
      abortedError.name = "AbortError";
      throw abortedError;
    }
    if (requestTimedOut) {
      const timeoutError = new Error(`SPLAT range ${start}-${end} timed out.`);
      timeoutError.name = "TimeoutError";
      throw timeoutError;
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener("abort", abortFromParent);
    }
  }
}

async function fetchRangeWithRetry(url, start, end, options) {
  let lastError = null;
  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    try {
      return await fetchRangeOnce(
        url,
        start,
        end,
        attempt,
        options.requestTimeoutMs,
        options.signal
      );
    } catch (error) {
      lastError = error;
      if ((options.signal && options.signal.aborted) || attempt === options.maxAttempts) {
        throw error;
      }
      await wait(500 * attempt);
    }
  }
  throw lastError;
}

export async function downloadSplatInChunks(url, options = {}) {
  const chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
  const settings = {
    maxAttempts: options.maxAttempts || DEFAULT_MAX_ATTEMPTS,
    requestTimeoutMs: options.requestTimeoutMs || DEFAULT_REQUEST_TIMEOUT_MS,
    signal: options.signal
  };
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};
  const firstRange = await fetchRangeWithRetry(url, 0, chunkSize - 1, settings);

  if (firstRange.completeFile) {
    onProgress({
      loadedBytes: firstRange.totalSize,
      percent: 100,
      totalBytes: firstRange.totalSize
    });
    return new Blob([firstRange.buffer], { type: "application/octet-stream" });
  }

  const totalBytes = firstRange.totalSize;
  const parts = [firstRange.buffer];
  let loadedBytes = firstRange.buffer.byteLength;
  onProgress({
    loadedBytes,
    percent: loadedBytes / totalBytes * 100,
    totalBytes
  });

  while (loadedBytes < totalBytes) {
    const start = loadedBytes;
    const end = Math.min(totalBytes - 1, start + chunkSize - 1);
    const range = await fetchRangeWithRetry(url, start, end, settings);
    if (range.completeFile || range.totalSize !== totalBytes) {
      throw new Error("SPLAT file changed while it was being downloaded.");
    }

    parts.push(range.buffer);
    loadedBytes += range.buffer.byteLength;
    onProgress({
      loadedBytes,
      percent: loadedBytes / totalBytes * 100,
      totalBytes
    });
  }

  if (loadedBytes !== totalBytes) {
    throw new Error(`SPLAT download size mismatch: expected ${totalBytes}, received ${loadedBytes}.`);
  }

  return new Blob(parts, { type: "application/octet-stream" });
}
