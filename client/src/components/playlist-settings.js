import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import FormCheckbox from "./form-checkbox";

export const PlaylistSettings = ({
  settingsList,
  handleToggle,
  handleDragEnd
}) => {
  const renderDraggable = useDraggableInPortal();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {settingsList.map((playlist, i) => (
              <Draggable
                key={`${i} ${playlist.id}`}
                draggableId={playlist.id.toString()}
                index={i}
              >
                {renderDraggable(provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <FormCheckbox
                      title={playlist.title}
                      i={i}
                      value={playlist.isConnected}
                      numTracks={playlist.total}
                      onChange={handleToggle}
                      isDraggable={true}
                      isStarred={playlist.isStarred}
                    />
                  </div>
                ))}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// https://github.com/atlassian/react-beautiful-dnd/issues/128#issuecomment-669083882
const useDraggableInPortal = () => {
  const self = useRef({}).current;

  useEffect(() => {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.pointerEvents = "none";
    div.style.top = "0";
    div.style.width = "100%";
    div.style.height = "100%";
    self.elt = div;
    document.body.appendChild(div);
    return () => {
      document.body.removeChild(div);
    };
  }, [self]);

  return render => (provided, ...args) => {
    const element = render(provided, ...args);
    if (provided.draggableProps.style.position === "fixed") {
      return createPortal(element, self.elt);
    }
    return element;
  };
};
