import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React from "react";

import FormCheckbox from "./form-checkbox";

export const PlaylistSettings = ({
  settingsList,
  handleToggle,
  handleDragEnd
}) => (
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
              {(provided, snapshot) => (
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
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);
