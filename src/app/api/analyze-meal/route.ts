import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set' },
        { status: 500 }
      )
    }
    const { description } = await req.json()

    if (!description) {
      return NextResponse.json(
        { error: 'Meal description is required' },
        { status: 400 }
      )
    }

    const prompt = `
      Analyze the nutritional content of the following meal description.
      Provide the estimated calories, protein, carbohydrates, and fat.
      Use the USDA database as a reference for your calculations to ensure accuracy.
      Return the data in the following JSON format:
      {
        "nutritionalInformation": {
          "calories": { "estimate": 200 },
          "protein": { "estimate": 30 },
          "carbohydrates": { "estimate": 5 },
          "fat": { "estimate": 10 }
        }
      }

      Meal: "${description}"
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = await response.text()

    // Extract the JSON part from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch || !jsonMatch[1]) {
      // Fallback for when the model doesn't return the json in a code block
      const secondJsonMatch = text.match(/{\s*"nutritionalInformation"[\s\S]*?}/);
      if (!secondJsonMatch || !secondJsonMatch[0]) {
        throw new Error('Invalid JSON response from AI');
      }
      const jsonString = secondJsonMatch[0].trim().replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const data = JSON.parse(jsonString);
      return NextResponse.json(data)
    }
    const jsonString = jsonMatch[1].trim().replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    const data = JSON.parse(jsonString);

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Failed to analyze meal' },
      { status: 500 }
    )
  }
}
