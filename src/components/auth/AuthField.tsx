// src/components/auth/AuthField.tsx
// label + input 연결된 공통 필드 컴포넌트

interface AuthFieldProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  rightLabel?: React.ReactNode   // 비밀번호 찾기 링크 등
}

export function AuthField({
  id, label, type = "text", placeholder, value, onChange, required, rightLabel,
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">
          {label}
          {required && <span className="text-primary ml-0.5">*</span>}
        </label>
        {rightLabel}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-[14px] text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary focus:bg-white transition-all"
      />
    </div>
  )
}