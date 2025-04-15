import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import Fuse from 'fuse.js';
import { data } from '@/data/data';

const server = new McpServer({
  name: 'KAWAII LAB.',
  version: '0.1.0',
});

const fuse = new Fuse(data, {
  keys: ['name', 'commonName', 'members.name', 'members.nickname'],
});

server.tool(
  'members',
  'KAWAII LAB. の情報を取得する',
  { groupName: z.string() },
  async ({ groupName }: { groupName: string }) => {
    const result = fuse.search(groupName);
    if (result.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `グループ ${groupName} は見つかりませんでした`,
          },
        ],
      };
    }

    const members = result[0].item.members;
    const membersString = JSON.stringify(members);
    const { name } = result[0].item;

    return {
      content: [
        {
          type: 'text',
          text: `members of ${name}: ${membersString}`,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP server running on stdio');
}

main().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
