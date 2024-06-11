import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import type { Component } from "solid-js";
import type { UseTextfieldProps } from "./textfield-types";

import { Match, Show, Switch } from "solid-js";
import { useTextfield } from "./use-textfield";

import { CloseFilledIcon } from "@saftox-ui/shared-icons";

export interface TextfieldProps
	extends Omit<UseTextfieldProps, "isMultiline"> {}

const Textfield: Component<TextfieldProps> = (props) => {
	const {
		Component,
		reactiveStates,
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
			<Show when={reactiveStates.isOutsideLeft}>
				<label {...getLabelProps()}>{props.label}</label>
			</Show>

			<Show
				when={reactiveStates.shouldLabelBeOutside}
				fallback={
					<>
						<div {...getInputWrapperProps()}>
							{/* labelContent */}
							<label {...getLabelProps()}>{props.label}</label>

							{/* innerWrapper */}
							<div {...getInnerWrapperProps()}>
								{props.startContent}
								<input {...getInputProps()} />

								{/* endContent */}
								<Show when={reactiveStates.isClearable}>
									<span {...getClearButtonProps()}>
										{props.description || <CloseFilledIcon />}
									</span>
								</Show>
							</div>
						</div>

						{/* helperWrapper */}
						<Show when={reactiveStates.hasHelper}>
							<div {...getHelperWrapperProps()}>
								<Switch>
									<Match
										when={
											reactiveStates.isInvalid && reactiveStates.errorMessage
										}
									>
										<div {...getErrorMessageProps()}>
											{reactiveStates.errorMessage}
										</div>
									</Match>

									<Match when={props.description}>
										<div {...getDescriptionProps()}>{props.description}</div>
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
						<Show when={!reactiveStates.isOutsideLeft}>
							<label {...getLabelProps()}>{props.label}</label>
						</Show>

						{/* innerWrapper */}
						<div {...getInnerWrapperProps()}>
							{props.startContent}
							<input {...getInputProps()} />

							{/* endContent */}
							<Show when={reactiveStates.isClearable}>
								<span {...getClearButtonProps()}>
									{props.endContent || <CloseFilledIcon />}
								</span>
							</Show>
						</div>
					</div>

					{/* helperWrapper */}
					<Show when={reactiveStates.hasHelper}>
						<div {...getHelperWrapperProps()}>
							<Switch>
								<Match
									when={reactiveStates.isInvalid && reactiveStates.errorMessage}
								>
									<div {...getErrorMessageProps()}>
										{reactiveStates.errorMessage}
									</div>
								</Match>

								<Match when={props.description}>
									<div {...getDescriptionProps()}>{props.description}</div>
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
