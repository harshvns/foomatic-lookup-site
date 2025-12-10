"use client"

import * as React from "react"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimpleSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
  triggerClassName?: string
}

interface SimpleSelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface SimpleSelectContextValue {
  value: string
  onValueChange: (value: string) => void
  onClose: () => void
}

const SimpleSelectContext = React.createContext<SimpleSelectContextValue | null>(null)

export function SimpleSelect({
  value,
  onValueChange,
  placeholder,
  children,
  className,
  triggerClassName,
}: SimpleSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [position, setPosition] = React.useState<'bottom' | 'top'>('bottom')
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Get the display text from children
  const getDisplayText = () => {
    let displayText = placeholder || "Select..."
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<SimpleSelectItemProps>(child) && child.props.value === value) {
        displayText = child.props.children as string
      }
    })
    return displayText
  }

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        triggerRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  // Calculate position when opening
  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      setPosition(spaceBelow < 256 && spaceAbove > spaceBelow ? 'top' : 'bottom')
    }
    setIsOpen(!isOpen)
  }

  const contextValue: SimpleSelectContextValue = {
    value,
    onValueChange: (newValue) => {
      onValueChange(newValue)
      setIsOpen(false)
      triggerRef.current?.focus()
    },
    onClose: () => setIsOpen(false),
  }

  return (
    <SimpleSelectContext.Provider value={contextValue}>
      <div className={cn("relative", className)}>
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            triggerClassName
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={cn(!value || value === "all" ? "text-muted-foreground" : "")}>
            {getDisplayText()}
          </span>
          <ChevronDownIcon className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div
            ref={contentRef}
            className={cn(
              "absolute z-50 w-full min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
              "max-h-64 overflow-y-auto",
              "animate-in fade-in-0 zoom-in-95",
              position === 'bottom' ? "top-full mt-1" : "bottom-full mb-1"
            )}
            role="listbox"
          >
            {children}
          </div>
        )}
      </div>
    </SimpleSelectContext.Provider>
  )
}

export function SimpleSelectItem({ value, children, className }: SimpleSelectItemProps) {
  const context = React.useContext(SimpleSelectContext)
  if (!context) throw new Error("SimpleSelectItem must be used within SimpleSelect")

  const isSelected = context.value === value

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        isSelected && "bg-accent/50",
        className
      )}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <CheckIcon className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
}

