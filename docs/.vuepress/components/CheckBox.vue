<template>
	<div class="check-box">
		<label :class="labelClass">
			<span class="checkbox__input">
				<input type="checkbox" :disabled="disabled" v-model="item">
				<span class="checkbox__control">
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden="true" focusable="false">
						<path fill='none' stroke='#000000' stroke-width='3' d='M1.73 12.91l6.37 6.37L22.79 4.59'/>
					</svg>
				</span>
			</span>
			<span class="radio__label">{{label}}</span>
		</label>

		<div v-if="subOptions" class="sub-options">
			<check-box v-for="option in subOptions" :label="option.text" :value="option.value" :disabled="disabled || !item || option.todo" :class="{todo: option.todo}"></check-box>
		</div>
	</div>
</template>

<script>
export default {
	name: "check-box",
	props: {
		label: {
			type: String,
			required: true
		},
		value: {
			type: String,
			required: true
		},
		subOptions: {
			type: Array,
			required: false,
			default: null
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	computed: {
		labelClass() {
			let classes = ['checkbox'];
			if (this.disabled)
				classes.push("checkbox--disabled");
			return classes.join(" ");
		},
		item:{
			get(){
				return this.$store.getters[this.value];
			},
			set(newValue){
				this.$store.commit(this.value, newValue)
			}
		}
	},

}
</script>

<style scoped>
.check-box {
	margin-top: 10px;
}
.sub-options {
	margin-left: 30px;
}

.checkbox {
	display: grid;
	grid-template-columns: min-content auto;
	grid-gap: 0.5em;
	font-size: 1rem;
	color: #000000;
}
.checkbox--disabled {
	color: #959495;
}

.checkbox--disabled path {
	stroke: #959495;
}

.checkbox--disabled .checkbox__control {
	border: 0.1em solid #959495;
}

.checkbox__control {
	display: inline-grid;
	width: 1em;
	height: 1em;
	border-radius: 0.25em;
	border: 0.1em solid #000000;
}
.checkbox__control svg {
	transition: transform 0.1s ease-in 25ms;
	transform: scale(0);
	transform-origin: bottom left;
}

.checkbox__input {
	display: grid;
	grid-template-areas: "checkbox";
}
.checkbox__input > * {
	grid-area: checkbox;
}
.checkbox__input input {
	opacity: 0;
	width: 1em;
	height: 1em;
}
.checkbox__input input:focus + .checkbox__control {
	box-shadow: 0 0 0 0.05em #fff, 0 0 0.15em 0.1em #000000;
}
.checkbox__input input:checked + .checkbox__control svg {
	transform: scale(1);
}
.checkbox__input input:disabled + .checkbox__control {
	color: #959495;
}

.todo {
	text-decoration: line-through;
}

</style>
