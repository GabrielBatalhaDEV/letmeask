import { useHistory } from "react-router-dom";
import illustrationImage from "../../assets/images/illustration.svg";
import logoImage from "../../assets/images/logo.svg";
import googleImage from "../../assets/images/google-icon.svg";

import "../../styles/auth.scss";
import { Button } from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../../services/firebase";
import { toastConfig } from "../../config/toastConfig";
import { toast } from "react-toastify";

function Home() {
  const history = useHistory();

  const { signInWithGoogle, user } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error("Room does not exists!", toastConfig);
      return;
    }

    if (roomRef.val().endedAt) {
      toast.warn("Room has been closed", toastConfig);
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImage} alt="Ilustração" />
        <strong>Cria salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImage} alt="LetMeAsk" />

          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleImage} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className="separator"> ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export { Home };
