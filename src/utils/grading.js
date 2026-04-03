export const gradeSubmission = (homework, studentAnswers) => {
  let score = 0
  let maxScore = 0
  let correct = 0
  let wrong = 0

  homework.questions.forEach(q => {
    maxScore += Number(q.score)
    const answer = studentAnswers[q.id]
    if (answer === q.correct) {
      score += Number(q.score)
      correct++
    } else {
      wrong++
    }
  })

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

  return {
    score,
    maxScore,
    correct,
    wrong,
    percentage,
    submittedAt: new Date().toISOString()
  }
}
