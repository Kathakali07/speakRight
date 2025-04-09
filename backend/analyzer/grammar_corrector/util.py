from gramformer import Gramformer
from nltk.tokenize import sent_tokenize, word_tokenize
from django.http import JsonResponse
import nltk
import torch


def set_seed(seed):
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

try:
    nltk.data.find('tokenizers/punkt_tab/english/')
except LookupError:
    nltk.download('punkt_tab')


set_seed(1212)

gf = Gramformer(models=1, use_gpu=False)


def count_words(text):
    """
    Count the total number of words in the given text.
    """
    words = word_tokenize(text)
    return len(words)


def count_changed_words(input_text, corrected_text):
    """
    Count the number of words that have been changed between input and corrected text.
    """
    words_input = word_tokenize(input_text)
    words_corrected = word_tokenize(corrected_text)

    changed_words = 0
    for word_input, word_corrected in zip(words_input, words_corrected):
        if word_input != word_corrected:
            changed_words += 1

    return changed_words


def calculate_accuracy(input_text, corrected_text):
    """
    Calculate the accuracy based on the formula:
    ((Total words - Changed words) / Total words) * 100
    """
    total_words = count_words(input_text)
    changed_words = count_changed_words(input_text, corrected_text)

    if total_words == 0:
        return 0
    accuracy = ((total_words - changed_words) / total_words) * 100
    return accuracy


def grammar_corrector(input_text):
    """
    Correct the grammar in the input text and return the corrected text,
    changes made, and accuracy.
    """
    sentences = sent_tokenize(input_text)
    output_text = []
    corrected_sentences = []
    changes = []

    # Process each sentence to correct grammar
    for s in sentences:
        if s.strip():
            new_corrected_sentences = gf.correct(s, max_candidates=1)
            corrected_sentences.extend(new_corrected_sentences)

            for corrected_sentence in new_corrected_sentences:
                output_text.append(corrected_sentence)

                # Get the edits made to the sentence
                edits = gf.get_edits(s, corrected_sentence)
                change_details = []

                for edit in edits:
                    change_details.append({
                        "Error Type": edit[0],
                        "Incorrect Word": edit[1],
                        "Corrected Word": edit[4]
                    })
                changes.append(change_details)

    # Join the corrected sentences to form the final corrected text
    corrected_text = " ".join(corrected_sentences)

    # Calculate the accuracy based on word changes
    accuracy = calculate_accuracy(input_text, corrected_text)

    return {
        "Input Text": input_text,
        "Output Text": output_text,
        "Changes": changes,
        "Accuracy": accuracy
    }
