process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { chromium } = require('playwright');
const fetch = require('node-fetch');
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

// cron.schedule.()

app.get('/api/noticias', async function (req, res) {
    try {
        const browser = await chromium.launch({
            headless: false
        });

        const context = await browser.newContext();
        const page = await context.newPage();
        const arrayTextos = [];

        page.goto('https://www.cetsp.com.br/noticias.aspx', { timeout: 60000 });

        const selectAno = '#ddlAnos';
        const selectMes = '#ddlMeses';
        const classBotao = '.btVerNoticia';
        const className = '.boxItemNoticia';

        const currentYear = new Date().getFullYear().toString();
        await page.selectOption(selectAno, currentYear);

        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        await page.selectOption(selectMes, currentMonth);

        await page.click(classBotao);

        await page.waitForSelector(className);

        const elements = await page.$$(className);
        for (const element of elements) {
            const text = await element.textContent();
            const response = await fetch('https://www.legnet.com.br:1330/assistant/asst_Yk2w9azlqy5F6pc9J8QMANSb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: text.trim() })
            });
            const data = await response.json();
            arrayTextos.push(JSON.parse(data.message));
        }

        res.json({
            data: arrayTextos
        })

        await browser.close();
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/noticias2', async function (req, res) {
    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const arrayTextos = [];

    await page.goto('https://cor.rio/interdicoes/');

    const className = '.elementor-widget-container';
    const elements = await page.$$(className);

    let stopCollecting = false;

    for (const element of elements) {
        const children = await element.$$('p, h3');
        for (const child of children) {
            const tagName = await child.evaluate(node => node.tagName.toLowerCase());

            if (tagName === 'h3') {
                const h3Text = await child.textContent();
                if (h3Text.trim() === 'Horários das reversíveis da cidade') {
                    stopCollecting = true;
                    break;
                }
            }

            if (tagName === 'p' && !stopCollecting) {
                const text = await child.textContent();
                const response = await fetch('https://www.legnet.com.br:1330/assistant/asst_Yk2w9azlqy5F6pc9J8QMANSb', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: text.trim() })
                });
                const data = await response.json();

                console.log(data.message)

                arrayTextos.push(JSON.parse(data.message));
            }
        }

        if (stopCollecting) break;
    }

    res.json({
        data: arrayTextos
    })

    await browser.close();
})


app.get('/api/noticias3', async function (req, res) {
    const browser = await chromium.launch({
        headless: false
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    const arrayTextos = [];

    await page.goto('https://www.otempo.com.br/transito', { timeout: 60000 });

    const inputCidade = '#cityInput';
    const classNameContainer = '.transito__container';
    const classNameWrapper = '.transito__wrapper';
    const botaoPesquisa = '.here__autocomplete--results';

    await page.click(inputCidade);

    await page.fill(inputCidade, 'Porto Alegre - RS');

    await page.waitForSelector(botaoPesquisa);
    await page.click(botaoPesquisa);
    await page.waitForTimeout(10000);

    const containers = await page.$$(classNameContainer);
    for (const container of containers) {
        const wrappers = await container.$$(classNameWrapper);
        for (const wrapper of wrappers) {
            const text = await wrapper.textContent();
            const response = await fetch('https://www.legnet.com.br:1330/assistant/asst_Yk2w9azlqy5F6pc9J8QMANSb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: text.trim() })
            });
            const data = await response.json();
            arrayTextos.push(JSON.parse(data.message));
        }
    }

    res.json({
        data: arrayTextos
    })

    await browser.close();
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
})