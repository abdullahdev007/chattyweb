import { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/auth/useLogin";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { loading, login } = useLogin();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ username, password });
  };

  useEffect(() => {
    document.title = "ChattyWeb: login";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div
        className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding \
      backdrop-filtre backdrop-blur-lg bg-opacity-0"
      >
        <h1 className="text-3xl font-semibold text-center text-color-gray-300">
          Login <span className="text-blue-500">ChattyWeb</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text"> Username </span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full input input-bordered h-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text"> Password </span>
            </label>
            <input
              type="password"
              placeholder="Enter psssword"
              className="w-full input input-bordered h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            to="/signup"
            className="text-sm hover:underline hover:text-blue-500 mt-2 inline-block"
          >
            {"Don't"} have an account ?
          </Link>
          <div>
            <button
              className="btn btn-block btn-sm mt-2"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
