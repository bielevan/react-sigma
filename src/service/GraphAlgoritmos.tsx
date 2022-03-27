export default function setDistanceCosine(
  vectorA: number[],
  vectorB: number[]
) {
  let product_vector = vectorA
    .map((item, index) => item * vectorB[index])
    .reduce((a, b) => a + b);
  let normA = Math.sqrt(
    vectorA.map((item) => item * item).reduce((a, b) => a + b)
  );
  let normB = Math.sqrt(
    vectorB.map((item) => item * item).reduce((a, b) => a + b)
  );
  let normalize = normA * normB;
  let cos = product_vector / normalize;
  return cos;
}

