"use client"
// 역할: 추천 위자드 전체 상태 관리 (컨트롤러)
//
// 동작 흐름:
//   - answers 객체로 5개 스텝 답변 중앙 관리
//   - currentStep 으로 어떤 스텝을 렌더링할지 결정
//   - currentStep === 6 이면 RecommendResult 렌더링
//   - 각 StepXxx 컴포넌트에 value/onChange + StepLayout에 onNext/onPrev 전달

import * as React from "react"
import { StepLayout }        from "@/components/recommend/StepLayout"
import { StepRegion }        from "@/components/recommend/StepRegion"
import { StepDuration }      from "@/components/recommend/StepDuration"
import { StepCompanion }     from "@/components/recommend/StepCompanion"
import { StepStyle }         from "@/components/recommend/StepStyle"
import { StepBudget }        from "@/components/recommend/StepBudget"
import { RecommendResult }   from "@/components/recommend/RecommendResult"

// 5개 스텝의 답변을 담는 타입
interface Answers {
  region:    string    // 1/5 여행지
  duration:  string    // 2/5 기간
  companion: string    // 3/5 동행자
  styles:    string[]  // 4/5 스타일 (복수)
  budget:    string    // 5/5 예산
}

// 각 스텝의 헤더 메타정보
const STEP_META = [
  {
    emoji: "🗺️",
    title: "어디로 떠나고 싶나요?",
    desc: "도시 1곳을 선택해주세요.",
  },
  {
    emoji: "📅",
    title: "며칠 여행인가요?",
    desc: "여행 기간을 선택해주세요.",
  },
  {
    emoji: "👫",
    title: "누구와 함께하나요?",
    desc: "동행자를 선택해주세요.",
  },
  {
    emoji: "✨",
    title: "어떤 스타일이 좋나요?",
    desc: "최대 3가지 여행 스타일을 골라주세요.",
  },
  {
    emoji: "💰",
    title: "예산은 어느 정도인가요?",
    desc: "1인 기준 예산을 선택해주세요. (항공 제외)",
  },
]

const TOTAL = 5

export default function RecommendPage() {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [answers, setAnswers] = React.useState<Answers>({
    region:    "",
    duration:  "",
    companion: "",
    styles:    [],
    budget:    "",
  })

  // 각 스텝에서 canNext 조건 계산
  const canNext = React.useMemo(() => {
    switch (currentStep) {
      case 1: return answers.region.trim() !== ""
      case 2: return answers.duration.trim() !== ""
      case 3: return answers.companion.trim() !== ""
      case 4: return answers.styles.length > 0
      case 5: return answers.budget.trim() !== ""
      default: return false
    }
  }, [currentStep, answers])

  const handleNext = () => {
    if (!canNext) return
    setCurrentStep((s) => s + 1)
  }

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(1, s - 1))
  }

  // 결과 화면 (step 6)
  if (currentStep === TOTAL + 1) {
    return (
      <RecommendResult
        answers={answers}
        onRetry={() => {
          // 처음부터 다시
          setCurrentStep(1)
          setAnswers({ region: "", duration: "", companion: "", styles: [], budget: "" })
        }}
      />
    )
  }

  const meta = STEP_META[currentStep - 1]

  return (
    <StepLayout
      step={currentStep}
      total={TOTAL}
      emoji={meta.emoji}
      title={meta.title}
      desc={meta.desc}
      canNext={canNext}
      onNext={handleNext}
      onPrev={currentStep > 1 ? handlePrev : undefined}
    >
      {currentStep === 1 && (
        <StepRegion
          value={answers.region}
          onChange={(v) => setAnswers((a) => ({ ...a, region: v }))}
        />
      )}
      {currentStep === 2 && (
        <StepDuration
          value={answers.duration}
          onChange={(v) => setAnswers((a) => ({ ...a, duration: v }))}
        />
      )}
      {currentStep === 3 && (
        <StepCompanion
          value={answers.companion}
          onChange={(v) => setAnswers((a) => ({ ...a, companion: v }))}
        />
      )}
      {currentStep === 4 && (
        <StepStyle
          value={answers.styles}
          onChange={(v) => setAnswers((a) => ({ ...a, styles: v }))}
        />
      )}
      {currentStep === 5 && (
        <StepBudget
          value={answers.budget}
          onChange={(v) => setAnswers((a) => ({ ...a, budget: v }))}
        />
      )}
    </StepLayout>
  )
}