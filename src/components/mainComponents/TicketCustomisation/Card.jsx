import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes.jsx";
import cardCancel from "../../../assets/images/cross.svg";

const style = {
  padding: 5,
  marginBottom: ".5rem",
  cursor: "move",
};

export const Card = ({ id, text, index, moveCard, deleteCategory }) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <>
      {text ? (
        <div className="cardIconStyling">
          <div
            ref={ref}
            style={{ ...style, opacity }}
            className="idCardStyle"
            data-handler-id={handlerId}
          >
            {text}
          </div>
          <div
            className="cardImgContainer"
            onClick={() => {
              deleteCategory(text);
            }}
          >
            <img src={cardCancel} />
          </div>
        </div>
      ) : null}
    </>
  );
};
