import type { Component } from "solid-js";
import type {
	TextAreaProps,
	TextareaHeightChangeMeta,
} from "./textfield-types";

import {
	Match,
	Show,
	Switch,
	createEffect,
	createSignal,
	mergeProps,
	splitProps,
} from "solid-js";
import { useTextfield } from "./use-textfield";

import { dataAttr } from "@saftox-ui/shared-utils";
import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { combineProps, combineStyle } from "@saftox-ui/solid-utils/reactivity";
import { TextareaAutosize } from "@saftox-ui/textarea-autosize";

const Textarea: Component<TextAreaProps> = (originalProps) => {
	const defaultProps = {
		minRows: 3,
		maxRows: 8,
		cacheMeasurements: false,
		disableAutosize: false,
		isMultiline: true,
	};

	const props = mergeProps(defaultProps, originalProps);

	const [local, rest] = splitProps(props, [
		"style",
		"minRows",
		"maxRows",
		"cacheMeasurements",
		"disableAutosize",
		"onHeightChange",
	]);

	const {
		states,
		Component,
		label,
		description,
		startContent,
		endContent,
		getBaseProps,
		getLabelProps,
		getInputProps,
		getInputWrapperProps,
		getInnerWrapperProps,
		getMainWrapperProps,
		getHelperWrapperProps,
		getDescriptionProps,
		getErrorMessageProps,
		getClearButtonProps,
	} = useTextfield<HTMLTextAreaElement>(
		combineProps(rest, { isMultiline: true }),
	);

	const [hasMultipleRows, setIsHasMultipleRows] = createSignal(
		local.minRows > 1,
	);
	const [isLimitReached, setIsLimitReached] = createSignal(false);
	const inputProps = getInputProps();

	const labelContent = () =>
		label ? <label {...getLabelProps()}>{label}</label> : null;

	const content = () => (
		<Show
			when={local.disableAutosize}
			fallback={
				<TextareaAutosize
					{...(getInputProps() as any)}
					cacheMeasurements={local.cacheMeasurements}
					data-hide-scroll={dataAttr(!isLimitReached)}
					maxRows={local.maxRows}
					minRows={local.minRows}
					style={combineStyle(inputProps.style, local.style)}
					onHeightChange={handleHeightChange}
				/>
			}
		>
			<textarea {...getInputProps()} />
		</Show>
	);

	const innerWrapper = () => (
		<Show
			when={startContent || endContent}
			fallback={<div {...getInnerWrapperProps()}>{content()}</div>}
		>
			<div {...getInnerWrapperProps()}>
				{startContent}
				{content()}
				{endContent}
			</div>
		</Show>
	);

	const handleHeightChange = (
		height: number,
		meta: TextareaHeightChangeMeta,
	) => {
		if (local.minRows === 1) {
			setIsHasMultipleRows(height >= meta.rowHeight * 2);
		}
		if (local.maxRows > local.minRows) {
			const limitReached = height >= local.maxRows * meta.rowHeight;

			setIsLimitReached(limitReached);
		}

		local.onHeightChange?.(height, meta);
	};

	return (
		<Dynamic as={Component} {...getBaseProps()}>
			{/* labelContent */}
			<Show when={states.isOutsideLeft}>{labelContent()}</Show>

			<div
				{...getInputWrapperProps()}
				data-has-multiple-rows={dataAttr(hasMultipleRows)}
			>
				{/* labelContent */}
				<Show when={states.shouldLabelBeInside}>{labelContent()}</Show>

				{/* innerWrapper */}
				{innerWrapper()}
			</div>

			{/* helperWrapper */}
			<Show when={states.hasHelper}>
				<div {...getHelperWrapperProps()}>
					<Switch>
						<Match when={states.isInvalid && states.errorMessage}>
							<div {...getErrorMessageProps()}>{states.errorMessage}</div>
						</Match>

						<Match when={description}>
							<div {...getDescriptionProps()}>{description}</div>
						</Match>
					</Switch>
				</div>
			</Show>
		</Dynamic>
	);
};

export default Textarea;
