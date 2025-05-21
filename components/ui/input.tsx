"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isSearch?: boolean
  onSearchClick?: () => void
  isHandleCheck?: boolean
  onHandleCheckClick?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isSearch, onSearchClick, isHandleCheck, onHandleCheckClick, ...props }, ref) => {
    const handleSearchClick = () => {
      if (onSearchClick) {
        onSearchClick()
      } else if (props.value) {
        // Default search action if no custom handler provided
        console.log("Searching for:", props.value)
      }
    }

    return (
      <div className={cn("w-full relative", isSearch && "flex justify-center items-center w-full")}>
        <input
          type={type}
          style={{
            borderRadius: "12px",
            boxShadow: "0 0 4px 1px rgba(0, 0, 0, 0.05)",
            transition: "all 0.2s ease",
            borderColor: "var(--border-color, #e2e8f0)",
            borderWidth: "1px",
            paddingRight: isSearch ? "50px" : isHandleCheck ? "110px" : undefined,
          }}
          className={cn(
            "flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 placeholder:opacity-40 focus-visible:outline-none focus-visible:ring-0 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
            isSearch ? "w-[700px] max-w-full" : "w-full",
            // 숫자 입력 필드의 증가/감소 버튼 제거
            type === "number" &&
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            className,
          )}
          pattern={type === "number" ? "[0-9]*" : undefined}
          onKeyDown={
            type === "number"
              ? (e) => {
                  // 소수점(.)과 마이너스(-) 키 입력 방지
                  if (e.key === "." || e.key === "-" || e.key === "e" || e.key === "E") {
                    e.preventDefault()
                  }
                }
              : undefined
          }
          onFocus={(e) => {
            e.target.style.boxShadow = "0 0 8px 2px rgba(0, 0, 0, 0.1)"
            e.target.style.borderColor = "#303030"
            e.target.style.borderWidth = "0.5px"
            if (props.onFocus) props.onFocus(e)
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = "0 0 4px 1px rgba(0, 0, 0, 0.05)"
            e.target.style.borderColor = "var(--border-color, #e2e8f0)"
            e.target.style.borderWidth = "1px"
            if (props.onBlur) props.onBlur(e)
          }}
          ref={ref}
          {...props}
        />
        {isSearch && (
          <button
            type="button"
            onClick={handleSearchClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "#424a44",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              border: "none",
            }}
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-white" />
          </button>
        )}
        {isHandleCheck && (
          <button
            type="button"
            onClick={onHandleCheckClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity text-white text-sm font-medium"
            style={{
              backgroundColor: "#424a44",
              borderRadius: "8px",
              padding: "0 12px",
              height: "36px",
              border: "none",
            }}
            aria-label="Check Handle"
          >
            @핸들 중복체크
          </button>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
