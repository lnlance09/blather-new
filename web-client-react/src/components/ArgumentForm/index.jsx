import { Button, Dropdown, Form, Label } from "semantic-ui-react"
import { useRef, useState } from "react"
import _ from "underscore"
import PropTypes from "prop-types"

const ArgumentForm = ({ contradictions, description, explanation, id, options, updateArg }) => {
	const [loading, setLoading] = useState(false)
	const [newContradictions, setNewContradictions] = useState(contradictions)

	const descriptionRef = useRef(null)
	const explanationRef = useRef(null)

	const onChangeC = async (e, { value }) => {
		setNewContradictions(value)
	}

	return (
		<Form>
			<Form.Field>
				<input
					defaultValue={description}
					id="descText"
					ref={descriptionRef}
					rows={6}
					placeholder="Enter title"
					style={{
						width: "100%"
					}}
				/>
			</Form.Field>
			<Form.Field>
				<textarea
					defaultValue={explanation}
					id="expText"
					ref={explanationRef}
					rows={6}
					placeholder="Enter description"
					style={{
						width: "100%"
					}}
				/>
			</Form.Field>
			<Form.Field>
				<Dropdown
					fluid
					multiple
					onChange={onChangeC}
					options={options}
					placeholder="Contradictions"
					renderLabel={(item) => {
						return (
							<Label
								color="blue"
								content={`${item.name} - ${item.value}`}
								key={item.value}
							/>
						)
					}}
					search
					selection
					value={newContradictions}
				/>
			</Form.Field>
			<Form.Field>
				<Button
					color="red"
					content="Save"
					fluid
					loading={loading}
					onClick={async () => {
						setLoading(true)
						const explanation = _.isEmpty(explanationRef.current)
							? ""
							: explanationRef.current.value
						const description = _.isEmpty(descriptionRef.current)
							? ""
							: descriptionRef.current.value
						await updateArg(id, description, explanation, newContradictions)
						setLoading(false)
					}}
				/>
			</Form.Field>
		</Form>
	)
}

ArgumentForm.propTypes = {
	contradictions: PropTypes.arrayOf(
		PropTypes.shape({
			description: PropTypes.string,
			explanation: PropTypes.string,
			id: PropTypes.number
		})
	),
	description: PropTypes.string,
	explanation: PropTypes.string,
	id: PropTypes.number,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			name: PropTypes.string,
			text: PropTypes.string,
			value: PropTypes.number
		})
	),
	updateArg: PropTypes.func
}

export default ArgumentForm
