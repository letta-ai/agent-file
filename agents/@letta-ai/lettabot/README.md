# LettaBot

A self-improving AI agent with advanced memory, connected to multi-channel messaging.

## What it does

LettaBot runs on a remote server and communicates across Telegram, Slack, Discord, WhatsApp, and Signal. It can:

- Execute tools and manage files
- Send messages, files, and voice notes
- React with emojis
- Schedule reminders and recurring tasks
- Load skills dynamically for specialized tasks
- Track todos and manage tasks

## Key features

- **Multi-channel messaging** - One agent, many platforms
- **Silent mode** - Background tasks don't spam users
- **Skill system** - Load specialized capabilities on demand
- **Scheduling** - Cron-based reminders and recurring jobs
- **Advanced memory** - Remembers context across conversations

## Use cases

- Personal assistant across all your messaging apps
- Team bot for Slack/Discord with memory
- Scheduled reminders and notifications
- File management and tool execution

## Tools

- `lettabot-message` - Send messages and files
- `lettabot-react` - Add emoji reactions
- `lettabot-schedule` - Create and manage scheduled tasks
- `lettabot-channels` - Discover available channels

## Installation

Import this agent file into your Letta server and configure your messaging channels via environment variables.
