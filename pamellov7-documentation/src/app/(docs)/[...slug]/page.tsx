import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

const mdxComponents = {
	// Example: MyCustomButton: MyCustomButton
};

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
	const params = await props.params;
	const page = source.getPage(params.slug);

	if (!page) {
		notFound();
	}

	const MDX = page.data.body;

	return (
		<article className="prose prose-invert max-w-none">
			<h1>{page.data.title}</h1>

			<MDX components={mdxComponents} />
		</article>
	);
}
