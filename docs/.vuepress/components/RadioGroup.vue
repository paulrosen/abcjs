<template>
	<div class="radio-group">
		<field-set :label="label">
			<template v-slot:controls>
				<label class="radio radio-gradient" v-for="item in options">
					<span class="radio__input">
						<input type="radio" :name="name" :value="item.value">
						<span class="radio__control"></span>
					</span>
					<span class="radio__label">{{item.text}}</span>
				</label>
			</template>
		</field-set>
	</div>
</template>

<script>
import FieldSet from "./FieldSet";
export default {
	name: "radio-group",
	components: {FieldSet},
	props: {
		label: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		options: {
			type: Array,
			required: true
		}
	}
}
</script>

<style scoped>
fieldset {
	margin-top: 1em;
}
.radio {
	display: grid;
	grid-template-columns: min-content auto;
	grid-gap: 0.5em;
	font-size: 1rem;
	color: #000000;
	margin-bottom: .5em;
}
.radio:focus-within .radio__label {
	transform: scale(1.05);
	opacity: 1;
}

.radio__label {
	line-height: 1;
	transition: 180ms all ease-in-out;
	opacity: 0.8;
}

.radio__input {
	display: flex;
}
.radio__input input {
	opacity: 0;
	width: 0;
	height: 0;
}
.radio__input input:focus + .radio__control {
	box-shadow: 0 0 0 0.05em #fff, 0 0 0.15em 0.1em #000000;
}

.radio-gradient input:checked + .radio__control {
	background: radial-gradient(#000000 50%, rgba(255, 0, 0, 0) 51%);
}

.radio-before .radio__control {
	display: grid;
	place-items: center;
}
.radio-before input + .radio__control::before {
	content: "";
	width: 0.5em;
	height: 0.5em;
	box-shadow: inset 0.5em 0.5em #000000;
	border-radius: 50%;
	transition: 180ms transform ease-in-out;
	transform: scale(0);
}
.radio-before input:checked + .radio__control::before {
	transform: scale(1);
}

.radio__control {
	display: block;
	width: 1em;
	height: 1em;
	border-radius: 50%;
	border: 0.1em solid #000000;
	transform: translateY(-0.05em);
}
</style>
