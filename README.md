# YouTube Cards Profile README

🎥 Utilize [Youtube Cards](https://github.com/matheusaudibert/youtube-cards) to display your YouTube videos in your GitHub Profile.

_The design of this project is inspired by [lanyard-profile-readme](https://github.com/cnrad/lanyard-profile-readme) — special thanks to [@cnrad](https://github.com/cnrad/)_

## Usage

In a `README.md` file, include the following, replacing `:id` with your Video ID:

```md
[![Youtube Card](https://youtube-cards-0wtu.onrender.com/api/:id)](https://www.youtube.com/watch?v=:id)
```

It should display something similar to the following (I am using my video ID as an example):

[![Youtube Card](https://youtube-cards-0wtu.onrender.com/api/UT8Z3U5gDsc)](https://www.youtube.com/watch?v=UT8Z3U5gDsc)

When others click it, they will be directed to your actual video. Neat!

## Options

You can customize the card using the following query parameters:

| Option              | Parameter                  | Description                                          |
| ------------------- | -------------------------- | ---------------------------------------------------- |
| **Theme**           | `theme=:theme`             | Set the theme (`github`, `dark`, or `light`).        |
| **Background**      | `background_color=:color`  | Set background color using a hex code (without `#`). |
| **Title Color**     | `title_color=:color`       | Set title color using a hex code (without `#`).      |
| **Stats Color**     | `stats_color=:color`       | Set stats color using a hex code (without `#`).      |
| **Border Radius**   | `border_radius=:radius`    | Set border radius in pixels (e.g., `10` for `10px`). |
| **Max Title Lines** | `max_title_lines=:lines`   | Set max number of lines for the video title.         |
| **Card Width**      | `width=:width`             | Set card width in pixels (e.g., `250`).              |
| **Show Duration**   | `show_duration=true/false` | Show or hide the video duration.                     |

_To see the limits and more details for each option, check out the project [Youtube Cards](https://github.com/matheusaudibert/youtube-cards)_.

## Example URL and Result

```markdown
[![YouTube Card](https://youtube-cards-0wtu.onrender.com/api/J75GuCvhLAE?theme=dark&background_color=283d7e&border_radius=10&title_color=FFFFFF&stats_color=DEDEDE&max_title_lines=1&width=250&show_duration=true)](https://www.youtube.com/watch?v=J75GuCvhLAE)
```

[![YouTube Card](https://youtube-cards-0wtu.onrender.com/api/J75GuCvhLAE?theme=dark&background_color=283d7e&border_radius=10&title_color=FFFFFF&stats_color=DEDEDE&max_title_lines=1&width=250&show_duration=true)](https://www.youtube.com/watch?v=J75GuCvhLAE)

_If you're using this in your profile, feel free to show support and give this repo a ⭐ star! It means a lot, thank you :)_
