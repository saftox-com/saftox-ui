import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import type { Component } from "solid-js";
import type { UseTextfieldProps } from "./textfield-types";

import { Match, Show, Switch, createEffect } from "solid-js";
import { useTextfield } from "./use-textfield";

import { CloseFilledIcon } from "@saftox-ui/shared-icons";

export interface TextfieldProps
	extends Omit<UseTextfieldProps, "isMultiline"> {}

const Textfield: Component<TextfieldProps> = (props) => {
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
	} = useTextfield(props);

	return (
		<Dynamic as={Component} {...getBaseProps()}>
			{/* labelContent */}
			<Show when={states.isOutsideLeft}>
				<label {...getLabelProps()}>{label}</label>
			</Show>

			<Show
				when={states.shouldLabelBeOutside}
				fallback={
					<>
						<div {...getInputWrapperProps()}>
							{/* labelContent */}
							<label {...getLabelProps()}>{label}</label>

							{/* innerWrapper */}
							<div {...getInnerWrapperProps()}>
								{startContent}
								<input {...getInputProps()} />

								{/* endContent */}
								<Show when={states.isClearable}>
									<span {...getClearButtonProps()}>
										{endContent || <CloseFilledIcon />}
									</span>
								</Show>
							</div>
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
					</>
				}
			>
				{/* mainWrapper */}
				<div {...getMainWrapperProps()}>
					<div {...getInputWrapperProps()}>
						{/* labelContent */}
						<Show when={!states.isOutsideLeft}>
							<label {...getLabelProps()}>{label}</label>
						</Show>

						{/* innerWrapper */}
						<div {...getInnerWrapperProps()}>
							{startContent}
							<input {...getInputProps()} />

							{/* endContent */}
							<Show when={states.isClearable}>
								<span {...getClearButtonProps()}>
									{endContent || <CloseFilledIcon />}
								</span>
							</Show>
						</div>
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
				</div>
			</Show>
		</Dynamic>
	);
};

export default Textfield;
