<template>
	<fieldset>
		<legend v-if="label">{{label}}</legend>
		<slot name="controls"></slot>
	</fieldset>
</template>

<script>
export default {
	name: "field-set",
	props: {
		label: {
			type: String,
			required: false,
			default: ""
		}
	},
}
</script>

<style scoped>
fieldset {
	margin-bottom: 1em;
	display: inline-block;
	width: calc(100% - 30px);
}

</style>
