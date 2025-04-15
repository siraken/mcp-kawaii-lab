import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import Fuse from 'fuse.js';
import { data } from '@/data/data';

const server = new McpServer({
  name: 'KAWAII LAB.',
  version: '0.1.0',
});

server.tool(
  'members',
  'KAWAII LAB. の情報を取得する',
  {
    query: z
      .string()
      .describe(
        'グループ名 or グループ名の通称 or メンバー名 or メンバーの愛称',
      ),
  },
  async ({ query }: { query: string }) => {
    const fuse = new Fuse(data, {
      keys: ['name', 'commonName', 'members.name', 'members.nickname'],
    });
    const result = fuse.search(query);
    if (result.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `グループ ${query} は見つかりませんでした`,
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
