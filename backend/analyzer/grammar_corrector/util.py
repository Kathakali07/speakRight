from gramformer import Gramformer
from nltk.tokenize import sent_tokenize, word_tokenize
from django.http import JsonResponse
import nltk
import torch
import re
import string

def set_seed(seed):
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

try:
    nltk.data.find('tokenizers/punkt/english')
except LookupError:
    nltk.download('punkt')

set_seed(1212)
gf = Gramformer(models=1, use_gpu=False)

# Utility to preprocess text: remove punctuation, lowercase
def preprocess_text(text):
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    return text.lower().split()

# Check if the change is significant (not just punctuation or case)
def is_significant_change(original, corrected):
    orig_clean = original.strip(string.punctuation).lower()
    corr_clean = corrected.strip(string.punctuation).lower()
    return orig_clean != corr_clean

def count_words(text):
    """
    Count the total number of meaningful words in the given text (ignores punctuation).
    """
    words = preprocess_text(text)
    return len(words)

def count_changed_words(input_text, corrected_text):
    """
    Count the number of word-level changes, ignoring punctuation and case.
    """
    words_input = preprocess_text(input_text)
    words_corrected = preprocess_text(corrected_text)

    changed_words = 0
    for word_input, word_corrected in zip(words_input, words_corrected):
        if word_input != word_corrected:
            changed_words += 1

    return changed_words

def calculate_accuracy(input_text, corrected_text):
    """
    Accuracy = ((Total words - Changed words) / Total words) * 100
    Ignores punctuation and case differences.
    """
    total_words = count_words(input_text)
    changed_words = count_changed_words(input_text, corrected_text)

    if total_words == 0:
        return 0
    accuracy = ((total_words - changed_words) / total_words) * 100
    return round(accuracy, 2)

def grammar_corrector(input_text):
    """
    Correct the grammar in the input text and return the corrected text,
    changes made, and accuracy.
    """
    sentences = sent_tokenize(input_text)
    output_text = []
    corrected_sentences = []
    changes = []

    for s in sentences:
        if s.strip():
            new_corrected_sentences = gf.correct(s, max_candidates=1)
            corrected_sentences.extend(new_corrected_sentences)

            for corrected_sentence in new_corrected_sentences:
                output_text.append(corrected_sentence)

                edits = gf.get_edits(s, corrected_sentence)
                for edit in edits:
                    if is_significant_change(edit[1], edit[4]):
                        change_str = f"{edit[1]} ➔ {edit[4]}"
                        changes.append(change_str)

    corrected_text = " ".join(corrected_sentences)
    accuracy = calculate_accuracy(input_text, corrected_text)

    return {
        "Input Text": input_text,
        "Output Text": output_text,
        "Changes": changes,
        "Accuracy": accuracy
    }
