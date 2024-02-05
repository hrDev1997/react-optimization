import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

const CounterContext = createContext({
  value: 0,
  onCounterChange: (value) => {}
});

function RerenderCounter() {
  const rerenders = useRef(0);
  useEffect(() => {
    rerenders.current += 1;
  });

  return <div>Rerender: {rerenders.current}</div>;
}

function Sidebar(props) {
    return (
    <div style={{ border: "1px solid black", padding: 5 }}>
      <strong>Sidebar</strong>
      <RerenderCounter />
      <Counter />
    </div>
  );
};

function Body(props) {
  /**
   * Моя ошибка была использование контекста в Body и Sidebar
   */
  return (
    <div style={{ border: "1px solid black", padding: 5 }}>
      <strong>Body</strong>
      <RerenderCounter />
      <Counter />
    </div>
  );
};

function Counter() {
  /**
   * Переносим использование контекста в Counter
   */
  const { value, onCounterChange } = useContext(CounterContext);
  
  return <button onClick={onCounterChange}>{value}</button>;
}

function App() {
  const [value, setValue] = useState(0);

  /**
   * Оборачиваем функциою в хук useCallback для мемоизации
   */
  const onCounterChange = useCallback(() => setValue((value) => value + 1 ), []);

  /**
   * Родительские компоненты оборачиваем в хук useMemo, чтобы предотвратить ненужные повторные рендеринги
   */
  const parentComponents = useMemo(() => (
    <div style={{ display: "flex", gap: 10 }}>
      <Sidebar />
      <Body />
    </div>
  ), []);

  return (
    <CounterContext.Provider value={{ value, onCounterChange }} >
      {parentComponents}
    </CounterContext.Provider>
  );
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
