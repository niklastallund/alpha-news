import Page from "@/components/Page";

import ArticleForms from "./forms/ArticleForms";

export default async function AdminArticlePage() {
  // const [categories, setCategories] = useState<Category[]>();
  // const [articles, setArticles] = useState<ArticleWithCat[]>();

  // const [upd, setUpd] = useState<boolean>(true); // so passing this allows articles and categories to be refreshed.

  // useEffect(() => {
  //   const getCategories = async () => {
  //     const cats = await getCats();

  //     if (cats) setCategories(cats);
  //     setUpd(false);
  //   };

  //   const getAllArticles = async () => {
  //     // Here we also could add filtering, i mean otherwise it will get alot of articles :P fix

  //     const arts: ArticleWithCat[] = await getArticles();
  //     if (arts) setArticles(arts);
  //   };

  //   if (upd) getCategories();

  //   if (upd) getAllArticles();
  // }, [upd]);

  // const allCategories = await prisma.category.findMany({
  //   orderBy: { name: "asc" },
  // });

  // const articles = await prisma.article.findMany({
  //   orderBy: { updatedAt: "desc" },
  //   include: { category: true },
  // });

  // const allCategories = await prisma.category.findMany({
  //   orderBy: { name: "asc" },
  // });

  return (
    <Page>
      <ArticleForms />
    </Page>
  );
}
