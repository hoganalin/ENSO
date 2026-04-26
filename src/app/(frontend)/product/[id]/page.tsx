import SingleProduct from "../../../../components/SingleProduct";

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { id } = await params;
  return <SingleProduct id={id} />;
}
