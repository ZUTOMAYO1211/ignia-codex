import { useState } from "react";
import Stepper, { Step } from "../components/Stepper.jsx";
import "./visuals.css";

// Walks through one turn using the worked example from the roleplay chapter.
export default function TurnDemo({ turn }) {
  const [round, setRound] = useState(0);
  const free = turn.options;
  return (
    <div className="turn-demo">
      <Stepper
        key={round}
        backButtonText="이전"
        nextButtonText="다음"
        completeButtonText="처음부터"
        onFinalStepCompleted={() => setRound((r) => r + 1)}
        renderStepIndicator={({ step, currentStep, onStepClick }) => (
          <button
            type="button"
            className={`turn-dot${step === currentStep ? " is-active" : step < currentStep ? " is-done" : ""}`}
            aria-label={`${step}단계`}
            aria-current={step === currentStep ? "step" : undefined}
            onClick={() => onStepClick(step)}
          >
            {step}
          </button>
        )}
      >
        <Step>
          <p className="turn-step-label">상황 묘사</p>
          <p className="turn-bubble is-gm">{turn.scene}</p>
        </Step>
        <Step>
          <p className="turn-step-label">선택지 {turn.options}개</p>
          <p className="turn-actor">▶ {turn.actor}</p>
          <ol className="turn-choices">
            {turn.choices.map((c, i) => (
              <li key={c} className={i === free - 1 ? "is-free" : ""}>
                <span>{i + 1}</span>
                {c}
                <em>{i === free - 1 ? "직접 입력" : "추천"}</em>
              </li>
            ))}
          </ol>
        </Step>
        <Step>
          <p className="turn-step-label">선택과 결과</p>
          <p className="turn-bubble">{turn.unit}</p>
          <div className="turn-actions" aria-label={`행동 ${turn.actions}번`}>
            {Array.from({ length: turn.actions }, (_, i) => (
              <span key={i}>
                행동 {i + 1}/{turn.actions}
              </span>
            ))}
          </div>
        </Step>
        <Step>
          <p className="turn-step-label">다음 차례</p>
          <ol className="turn-flow">
            {turn.steps.slice(2).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </Step>
      </Stepper>
    </div>
  );
}
