import { useHistory, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import logoImage from "../../assets/images/logo.svg";
import { Button } from "../../components/Button";
import { Question } from "../../components/Question";
import { RoomCode } from "../../components/RoomCode";
import { toastConfig } from "../../config/toastConfig";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import "../../styles/room.scss";

type RoomParams = {
  id: string;
};

function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory();

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleHighlightQuestion(
    questionId: string,
    isHighlighted?: boolean
  ) {
    if (isHighlighted) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false,
      });
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      });
    }
  }

  async function handleCheckQuestionAnswered(
    questionId: string,
    isAnswered?: boolean
  ) {
    if (isAnswered) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: false,
      });
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
      });
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja deletar essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

      toast.success("Question deleted!", toastConfig);
    }
  }

  return (
    <div id="page-room">
      <ToastContainer />
      <header>
        <div className="content">
          <img src={logoImage} alt="LetMeAsk" />
          <div>
            <RoomCode code={params.id}></RoomCode>
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

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
                    className="check-button"
                    onClick={() =>
                      handleHighlightQuestion(
                        question.id,
                        !!question.isHighlighted
                      )
                    }
                    aria-label="Dar destaque á pergunta"
                  >
                    <svg
                      viewBox="0 0 32 32"
                      fill="#737380"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke="none"
                        d="M13.17,29.9a4,4,0,0,1-2.83-1.17L4.69,23.07a4,4,0,0,1,0-5.66L18.83,3.27a4.1,4.1,0,0,1,5.66,0L27.31,6.1a4,4,0,0,1,0,5.66L16,23.07a4,4,0,0,1-5.66-5.66l9.2-9.19L21,9.64l-9.19,9.19a2,2,0,0,0,2.83,2.83L25.9,10.34a2,2,0,0,0,0-2.83L23.07,4.69a2,2,0,0,0-2.83,0L6.1,18.83a2,2,0,0,0,0,2.83l5.66,5.65a2,2,0,0,0,2.83,0l12-12L28,16.71l-12,12A4,4,0,0,1,13.17,29.9Z"
                      />
                    </svg>
                  </button>
                )}
                <button
                  className="answer-button"
                  onClick={() =>
                    handleCheckQuestionAnswered(
                      question.id,
                      !!question.isAnswered
                    )
                  }
                  aria-label="Marcar como respondida"
                >
                  <svg
                    viewBox="0 0 32 32"
                    fill="#737380"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M26,3H6A3,3,0,0,0,3,6V30.41l5.12-5.12A1.05,1.05,0,0,1,8.83,25H26a3,3,0,0,0,3-3V6A3,3,0,0,0,26,3Zm1,19a1,1,0,0,1-1,1H8.83a3,3,0,0,0-2.12.88L5,25.59V6A1,1,0,0,1,6,5H26a1,1,0,0,1,1,1Z" />
                    <rect height="2" width="12" x="10" y="11" />
                    <rect height="2" width="7" x="10" y="15" />
                  </svg>
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDeleteQuestion(question.id)}
                  aria-label="Deletar pergunta"
                >
                  <svg
                    viewBox="0 0 32 32"
                    fill="#737380"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="12" width="2" x="15" y="12" />
                    <rect height="12" width="2" x="19" y="12" />
                    <rect height="12" width="2" x="11" y="12" />
                    <path d="M20,6V5a3,3,0,0,0-3-3H15a3,3,0,0,0-3,3V6H4V8H6V27a3,3,0,0,0,3,3H23a3,3,0,0,0,3-3V8h2V6ZM14,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H14ZM24,27a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V8H24Z" />
                  </svg>
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export { AdminRoom };
