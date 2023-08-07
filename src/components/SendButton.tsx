import './SendButton.css';

const SendButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="sendButton" onClick={onClick}>
      Send
    </button>
  );
};

export default SendButton;
