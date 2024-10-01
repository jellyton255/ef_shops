import { cn } from "@/lib/utils";
import "./Loader.css";

export default function Loader({ className }: { className?: string }) {
	return (
		<svg className={cn(className, "loader-container")} x="0px" y="0px" viewBox="0 0 37 37" height="37" width="37" preserveAspectRatio="xMidYMid meet">
			<path
				className="loader-track"
				fill="none"
				strokeWidth="5"
				pathLength="100"
				d="M0.37 18.5 C0.37 5.772 5.772 0.37 18.5 0.37 S36.63 5.772 36.63 18.5 S31.228 36.63 18.5 36.63 S0.37 31.228 0.37 18.5"
			></path>
			<path
				className="loader-car"
				fill="none"
				strokeWidth="5"
				pathLength="100"
				d="M0.37 18.5 C0.37 5.772 5.772 0.37 18.5 0.37 S36.63 5.772 36.63 18.5 S31.228 36.63 18.5 36.63 S0.37 31.228 0.37 18.5"
			></path>
		</svg>
	);
}
