export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { name, userIp } = req.body;
  const webhookUrl = process.env.DISCORD_WEBHOOK;

  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook não configurado no servidor' });
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: "🚨 Novo Salve / Registro de Acesso!",
          color: 16711740,
          fields: [
            { name: "👤 Visitante", value: name || 'Anônimo', inline: true },
            { name: "🌐 Endereço IP", value: `\`${userIp || 'Não identificado'}\``, inline: true }
          ],
          footer: { text: "Sistema Pavuna • Log de Acesso" },
          timestamp: new Date().toISOString()
        }]
      })
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
