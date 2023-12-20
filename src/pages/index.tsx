import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-gray-900 text-3xl font-semibold text-center my-6">
        会議室予約システムへようこそ！
      </h1>
      <p className="text-gray-700 text-lg text-center mb-6">
        ここで最適な会議室を見つけ、簡単に予約ができます。
      </p>
      <div className="flex flex-col items-center space-y-4">
        <Link href="/login">
          <div className="text-blue-600 hover:text-blue-800 font-medium underline">
            ログインページ
          </div>
        </Link>
        <Link href="/guestPage">
          <div className="text-blue-600 hover:text-blue-800 font-medium underline">
            ゲストの方はこちら
          </div>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
