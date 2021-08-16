import { FormEvent } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import logoImage from "../../assets/images/logo.svg";
import { Button } from "../../components/Button";
import { Question } from "../../components/Question";
import { RoomCode } from "../../components/RoomCode";
import { useAuth } from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import "../../assets/images/like.svg";

import "../../styles/room.scss";
import { toast, ToastContainer } from "react-toastify";
import { toastConfig } from "../../config/toastConfig";

type RoomParams = {
  id: string;
};

function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  const [newQuestion, setNewQuestion] = useState("");

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === null) {
      return;
    }

    if (!user) {
      toast.error("You must be logged in", toastConfig);
      return;
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  }

  async function handleLikeQuestion(
    questionsId: string,
    likeId: string | undefined
  ) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionsId}/likes/${likeId}`)
        .remove();
    } else {
      await database
        .ref(`rooms/${roomId}/questions/${questionsId}/likes`)
        .push({
          authorId: user?.id,
        });
    }
  }

  return (
    <div id="page-room">
      <ToastContainer />
      <header>
        <div className="content">
          <img src={logoImage} alt="LetMeAsk" />
          <RoomCode code={params.id}></RoomCode>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login.</button>
              </span>
            )}

            <Button type="submit" disabled={!user}>
              Enviar Perguntas
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={!!question.isAnswered}
                isHighlighted={!!question.isHighlighted}
              >
                {!question.isAnswered && (
                  <button
                    className={`like-button ${question.likeId ? "liked" : ""}`}
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() => {
                      handleLikeQuestion(question.id, question.likeId);
                    }}
                  >
                    {question.likeCount > 0 && (
                      <span>{question.likeCount}</span>
                    )}
                    <svg
                      id="Outlined"
                      viewBox="0 0 32 32"
                      height="24"
                      width="24"
                      fill="#737380"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24,11H21V5a3,3,0,0,0-3-3h-.4a3,3,0,0,0-2.91,2.28l-2,5.5A1.84,1.84,0,0,1,11,11H3V29H24a5,5,0,0,0,5-5V16A5,5,0,0,0,24,11ZM9,27H5V13H9Zm18-3a3,3,0,0,1-3,3H11V13a3.83,3.83,0,0,0,3.61-2.55l2-5.55,0-.12a1,1,0,0,1,1-.78H18a1,1,0,0,1,1,1v8h5a3,3,0,0,1,3,3Z" />
                    </svg>
                  </button>
                )}
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export { Room };
