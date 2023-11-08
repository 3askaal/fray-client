export const formatProductSizes = (product: any) => {
  const { id, __component, ...sizesValues } = product.sizes[0];
  const sizes = Object.entries(sizesValues)
    .reduce((acc, [key, value]) => value ? { ...acc, [key]: value } : acc, {});

  return {
    ...product,
    sizes
  }
}
