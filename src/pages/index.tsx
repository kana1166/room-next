import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <div>
          <Link href="/login">
            <p className="text-blue-500 hover:underline">ログインページ</p>
          </Link>
          <Link href="/guestPage">
            <p className="text-blue-500 hover:underline">ゲストの方はこちら</p>
          </Link>
        </div>
        <h1 className="text-gray-900 text-center my-4">
          会議室予約システムへようこそ！
        </h1>
        <p className="text-gray-900 text-center">
          ここで最適な会議室を見つけ、簡単に予約ができます。
        </p>
      </div>
    </>
  );
};
export default HomePage;
