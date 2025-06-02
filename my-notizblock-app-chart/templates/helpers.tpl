{{/*
Generate the name of the chart.
*/}}
{{- define "my-notizblock-app-chart.name" -}}
{{- .Chart.Name -}}
{{- end -}}

{{/*
Generate the full name of the resource by combining the release name and the chart name.
*/}}
{{- define "my-notizblock-app-chart.fullname" -}}
{{- .Release.Name }}-{{ .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end -}}