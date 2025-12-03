import { useState } from "react";
import * as AuthService from "../services/auth.service";
import type { AccessTokenType, User } from "../dtos/auth.dto";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [nom, setNom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorPassword("Mot de passe incorrect");
      return;
    }
    setErrorPassword("");

    try {
      setIsLogin(true);

      const user: User = await AuthService.register({
        nom,
        email,
        mot_de_passe: password,
      });

      const token: AccessTokenType = await AuthService.login({
        email: user.email,
        mot_de_passe: confirmPassword,
      });
      login(token.accessToken);
      console.log("Login successfull");
      setIsLogin(false);

      navigate("/", { replace: true });
    } catch (error) {
      console.log("Authentification failed.\n", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-200 border-base-300 rounded-box w-xs border p-4"
    >
      <label className="label">Nom</label>
      <input
        className="input"
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Votre nom"
      />
      <label className="label">Email</label>
      <input
        className="input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <label className="label">Mot de passe</label>
      <input
        className="input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <label className="label">Confirmer le mot de passse</label>{" "}
      {`${errorPassword && errorPassword}`}
      <input
        className="input"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="btn btn-neutral mt-4">{`${
        isLogin ? "Login..." : "Login"
      }`}</button>
      <div className="hover:text-blue-600 cursor-pointer">
        <Link to="/register">Creer un compte</Link>
      </div>
    </form>
  );
}

export default Register;
