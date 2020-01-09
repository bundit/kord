export default function rippleEffect(e) {
  // This is necessary to remove the element after
  // due to React's synthetic events. It will normally
  // pool events to reuse them which would not let us remove
  // the ripple span after the function has completed
  e.persist();

  const bound = e.target.getBoundingClientRect();

  const x = e.clientX - bound.left;
  const y = e.clientY - bound.top;

  const rippleSpan = document.createElement("span");
  rippleSpan.className = "ripple";
  rippleSpan.style.top = `${y}px`;
  rippleSpan.style.left = `${x}px`;

  e.target.appendChild(rippleSpan);
  setTimeout(() => e.target.removeChild(rippleSpan), 500);
}
