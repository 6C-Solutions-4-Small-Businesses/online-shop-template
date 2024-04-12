<script lang="ts">
    import {dev} from '$app/environment'

    export let name: string
    export let imageRemoteUrl: string
    export let classes: string
    export let width = 160

    function optimize(src: string, widths = [160, 640], quality = 90) {
        if (dev) return src

        return widths
            .slice()
            .sort((a, b) => a - b)
            .map((width, i) => {
                const url = `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
                const descriptor = i < widths.length - 1 ? ` ${width}w` : ''
                return url + descriptor
            })
            .join(', ')
    }
</script>
<img alt={name}
     class="{classes}"
     src={optimize(imageRemoteUrl, [width], 90)}
     width="{width}"
>
