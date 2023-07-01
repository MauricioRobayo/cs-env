export async function processInBatches<T>({
  fnc,
  data,
  batchSize,
}: {
  fnc: (arg: T) => Promise<void>;
  data: T[];
  batchSize: number;
}) {
  const batch = [];
  for (const item of data) {
    batch.push(fnc(item));
    if (batch.length >= batchSize) {
      await Promise.all(batch);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      batch.length = 0;
    }
  }

  if (batch.length) {
    await Promise.all(batch);
  }
}
