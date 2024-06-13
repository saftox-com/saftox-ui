import type { MaybeAccessor } from "@saftox-ui/solid-utils/reactivity";
import type { GlowEffectVariantProps } from "@saftox-ui/theme";
import type { Component } from "solid-js";

import { access } from "@saftox-ui/solid-utils/reactivity";
import { glowEffect } from "@saftox-ui/theme";
import { createEffect, createSignal, splitProps } from "solid-js";

export type GlowEffectProps = {
	ref?: MaybeAccessor<HTMLElement | undefined>;
	color?: GlowEffectVariantProps["color"];
	radius?: GlowEffectVariantProps["radius"];
};

const GlowEffect: Component<GlowEffectProps> = (props) => {
	const [mousePosition, setMousePosition] = createSignal({
		x: "-100%",
		y: "-100%",
	});

	const [local, rest] = splitProps(props, ["color", "radius"]);

	const styles = () => glowEffect(local);

	createEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const rect = access(rest.ref)?.getBoundingClientRect();
			if (!rect) return;
			const x = e.clientX - rect?.left;
			const y = e.clientY - rect?.top;

			// Check if the mouse is near the domRef
			const nearThreshold = rect.width + 100; // pixels
			if (Math.abs(x) <= nearThreshold && Math.abs(y) <= nearThreshold) {
				setMousePosition({ x: `${x}px`, y: `${y}px` });
			}
		};
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div class={styles().base()}>
			<svg
				class={styles().svg()}
				style={{
					left: mousePosition().x,
					top: mousePosition().y,
				}}
			/>
		</div>
	);
};

export { GlowEffect };
