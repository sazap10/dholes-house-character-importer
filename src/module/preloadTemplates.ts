export const preloadTemplates = async function() {
	const templatePaths = [
		"modules/dhole-importer/templates/importer.html"
	];

	return loadTemplates(templatePaths);
}
