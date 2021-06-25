import { useParams } from 'react-router';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
// import { database } from '../services/firebase';
import deleteImg from '../assets/images/delete.svg'
import '../styles/room.scss';
import { database } from '../services/firebase';
import { useHistory } from 'react-router-dom';


type RoomParams = {
  id: string;
}


export function AdminRoom(){
  //const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions} = useRoom(roomId); 
  const history = useHistory();

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }
  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Deseja realmente remover essa pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }
 
  return (
    <div id="page-room">
      <header>
        <div className="content"> 
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1> Nome da Sala: {title} </h1>
          {questions.length > 0 && <span> {questions.length} pergunta(s) </span>}
        </div>
        <div className="question-list">
          {questions.map(question => {
          return (
            <Question 
              key={question.id}
              content={question.content}
              author={question.author}
            > 
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover Pergunta" />
              </button>
            
            </Question>
          );
        })}
        </div>
        
      </main>
    </div>
  )
}