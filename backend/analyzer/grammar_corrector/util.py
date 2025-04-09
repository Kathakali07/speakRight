from gramformer import Gramformer
from django.http import JsonResponse
import torch

def set_seed(seed):
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

def grammar_corrector(input_text):
    set_seed(1212)

    gf = Gramformer(models=1, use_gpu=False)

    output_text = list(gf.correct(input_text, max_candidates=1))[0]

    return JsonResponse({
        "Input Text": input_text,
        "Output Text": output_text
    })
