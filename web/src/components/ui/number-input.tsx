import React, { useState, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputProps {
	w?: number;
	value: number;
	max: number;
	clampBehavior?: "strict";
	startValue?: number;
	onChange: (value: number) => void;
	isAllowed: (values: { floatValue: number }) => boolean;
	min?: number;
	allowDecimal?: boolean;
	allowNegative?: boolean;
	className?: string;
}

export default function NumberInput({
	value,
	max,
	clampBehavior = "strict",
	//startValue = 1,
	onChange,
	isAllowed,
	min = 1,
	allowDecimal = false,
	//allowNegative = false,
	className,
}: NumberInputProps) {
	const [inputValue, setInputValue] = useState<string>(value.toString());

	useEffect(() => {
		setInputValue(value.toString());
	}, [value]);

	const handleChange = useCallback(
		(newValue: number) => {
			if (newValue >= min && newValue <= max && isAllowed({ floatValue: newValue })) {
				onChange(newValue);
			}
		},
		[min, max, isAllowed, onChange],
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		if (newValue === "" || (allowDecimal && newValue === ".")) {
			setInputValue(newValue);
			return;
		}

		const numericValue = allowDecimal ? parseFloat(newValue) : parseInt(newValue, 10);
		if (!isNaN(numericValue)) {
			if (clampBehavior === "strict") {
				const clampedValue = Math.min(Math.max(numericValue, min), max);
				setInputValue(clampedValue.toString());
				handleChange(clampedValue);
			} else {
				setInputValue(newValue);
				if (numericValue >= min && numericValue <= max) {
					handleChange(numericValue);
				}
			}
		}
	};

	const handleBlur = () => {
		const numericValue = allowDecimal ? parseFloat(inputValue) : parseInt(inputValue, 10);
		if (isNaN(numericValue) || numericValue < min) {
			setInputValue(min.toString());
			handleChange(min);
		} else if (numericValue > max) {
			setInputValue(max.toString());
			handleChange(max);
		}
	};

	const increment = () => {
		const newValue = value + 1;
		if (newValue <= max && isAllowed({ floatValue: newValue })) {
			handleChange(newValue);
		}
	};

	const decrement = () => {
		const newValue = value - 1;
		if (newValue >= min && isAllowed({ floatValue: newValue })) {
			handleChange(newValue);
		}
	};

	return (
		<div className={cn(`inline-flex w-14 rounded-md shadow-sm`, className)}>
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onBlur={handleBlur}
				className={`block min-h-min w-full rounded-l-md bg-secondary px-1 focus:outline-none focus:ring-0 focus-visible:ring-0`}
				min={min}
				max={max}
				step={allowDecimal ? 0.01 : 1}
			/>
			<div className="inline-flex flex-col -space-y-px rounded-r-md focus:outline-none focus:ring-0 focus-visible:ring-0">
				<button type="button" className={`rounded-tr-md border bg-secondary hover:bg-muted/50 focus:outline-none`} onClick={increment}>
					<ChevronUp className="h-3 w-3" />
				</button>
				<button type="button" className={`rounded-br-md border bg-secondary hover:bg-muted/50 focus:outline-none`} onClick={decrement}>
					<ChevronDown className="h-3 w-3" />
				</button>
			</div>
		</div>
	);
}
