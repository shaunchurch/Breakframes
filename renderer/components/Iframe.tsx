import * as React from "react";

interface Props {
  id?: string;
  src: string;
  width: number;
  height: number;
  onScroll?: Function;
  onActive?: Function;
  scrollPosition: number;
  masterFrame: string;
  name: string;
}

export default function Iframe({
  id = "",
  src,
  width,
  height,
  onScroll,
  scrollPosition: siblingScrollPosition,
  name,
  masterFrame
}: Props) {
  const frame = React.useRef<HTMLIFrameElement>(null!);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!frame.current.contentWindow) throw new Error("No contentWindow");
    // don't scroll if we're leading
    if (name === masterFrame) return;

    frame.current.contentWindow.scrollTo({
      top: siblingScrollPosition
    });
  }, [siblingScrollPosition, name, masterFrame]);

  const handleScrollFrame = (e: Event) => {
    if (!e.target) throw new Error("No target iframe");

    const scrollPosition = getScrollPosition(frame.current);

    if (!scrollPosition) {
      throw new Error("could not find scroll postion");
    }

    const positionPercentage =
      (scrollPosition.height / 100) * scrollPosition.positionPercentage;

    if (onScroll && name === masterFrame) {
      onScroll(positionPercentage, name);
    }
  };

  React.useEffect(() => {
    if (isLoaded && frame.current.contentWindow) {
      frame.current.contentWindow.addEventListener(
        "scroll",
        e => handleScrollFrame(e),
        {
          passive: true
        }
      );
    }
  }, [isLoaded]);

  return (
    <section style={{ display: "block" }}>
      <span style={{ color: "#888", padding: "10px", fontSize: "12px" }}>
        {width}x{height}
      </span>
      <br />
      <iframe
        onLoad={() => setIsLoaded(true)}
        id={id}
        ref={frame}
        src={src}
        width={width}
        sandbox="allow-same-origin allow-scripts allow-forms"
        height={height}
        style={{
          margin: "10px",
          marginTop: 0,
          border: "none",
          borderRadius: "2px",
          boxShadow: "3px 3px 20px rgba(0,0,0,.9)",
          background: "white"
        }}
      />
    </section>
  );
}

function getScrollPosition(frame: HTMLIFrameElement) {
  const body = frame.contentDocument ? frame.contentDocument.body : null;
  const html = frame.contentDocument
    ? frame.contentDocument.documentElement
    : null;

  if (!body || !html) {
    return null;
  }

  let scrollPosition = {
    height: Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    ),
    scrollY: frame.offsetHeight,
    positionPercentage: 0
  };

  scrollPosition.positionPercentage =
    (html.scrollTop / (scrollPosition.height - html.clientHeight)) * 100;
  return scrollPosition;
}
