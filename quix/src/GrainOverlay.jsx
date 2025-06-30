const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  pointerEvents: 'none',
  zIndex: 9999,
  opacity: 0.18,
  mixBlendMode: 'overlay',
  background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'100\' height=\'100\' fill=\'white\'/%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1.5\' fill=\'black\' fill-opacity=\'0.12\'/%3E%3Ccircle cx=\'80\' cy=\'40\' r=\'1.2\' fill=\'black\' fill-opacity=\'0.09\'/%3E%3Ccircle cx=\'50\' cy=\'80\' r=\'1.1\' fill=\'black\' fill-opacity=\'0.11\'/%3E%3C/svg%3E") repeat',
  animation: 'grainMove 1.5s steps(10) infinite',
};

const keyframes = `@keyframes grainMove { 0% {background-position: 0 0;} 100% {background-position: 10px 10px;} }`;

function GrainOverlay() {
  return (
    <>
      <style>{keyframes}</style>
      <div style={style} />
    </>
  );
}

export default GrainOverlay; 