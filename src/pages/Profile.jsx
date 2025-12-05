import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <>
      <h1>Hello {user?.username}!</h1>
      <p>Total amount owed: $0.00</p>
    </>
  );
}